import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase/config";

// Default fallback data (empty - live data loaded from Firestore)
export const defaultProjects = [];
export const defaultEvents = [];
export const defaultMilestones = [];
export const defaultCertifications = [];

// Helper to subscribe to any collection in real time
export const subscribeCollection = (collectionName, callback, defaultData = []) => {
  if (!db) {
    callback(defaultData);
    return () => {};
  }

  try {
    const q = query(collection(db, collectionName), orderBy("order", "asc"));
    return onSnapshot(
      q, 
      (snapshot) => {
        if (snapshot.empty) {
          callback(defaultData);
        } else {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(items);
        }
      },
      (error) => {
        console.warn(`Firestore subscription fallback for ${collectionName}:`, error);
        callback(defaultData);
      }
    );
  } catch (err) {
    console.warn(`Firestore error for ${collectionName}:`, err);
    callback(defaultData);
    return () => {};
  }
};

// CRUD Operations for Projects
export const addProject = async (projectData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "projects"), {
    ...projectData,
    order: Number(projectData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateProject = async (id, projectData) => {
  if (!db) throw new Error("Database not connected");
  const projectRef = doc(db, "projects", id);
  return await updateDoc(projectRef, {
    ...projectData,
    updatedAt: serverTimestamp()
  });
};

export const deleteProject = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "projects", id));
};

// CRUD Operations for Events
export const addEvent = async (eventData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "events"), {
    ...eventData,
    order: Number(eventData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateEvent = async (id, eventData) => {
  if (!db) throw new Error("Database not connected");
  const eventRef = doc(db, "events", id);
  return await updateDoc(eventRef, {
    ...eventData,
    updatedAt: serverTimestamp()
  });
};

export const deleteEvent = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "events", id));
};

export const reorderEvents = async (orderedEvents) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedEvents.forEach((item, index) => {
    if (item.id) {
      const eventRef = doc(db, "events", item.id);
      batch.update(eventRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

export const reorderProjects = async (orderedProjects) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedProjects.forEach((item, index) => {
    if (item.id) {
      const pRef = doc(db, "projects", item.id);
      batch.update(pRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

export const reorderMilestones = async (orderedMilestones) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedMilestones.forEach((item, index) => {
    if (item.id) {
      const mRef = doc(db, "milestones", item.id);
      batch.update(mRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

export const reorderCertifications = async (orderedCertifications) => {
  if (!db) throw new Error("Database not connected");
  const batch = writeBatch(db);
  orderedCertifications.forEach((item, index) => {
    if (item.id) {
      const cRef = doc(db, "certifications", item.id);
      batch.update(cRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  return await batch.commit();
};

// Smart date parser converting varied formats into epoch milliseconds for accurate sorting
export const parseDateString = (itemOrDate) => {
  if (!itemOrDate) return 0;

  // Strictly extract the date string entered by the admin in the date field
  let rawStr = "";
  if (typeof itemOrDate === "string") {
    rawStr = itemOrDate;
  } else if (typeof itemOrDate === "object") {
    // Strictly prioritize the human-entered date / timeline string, NEVER using creation timestamps
    rawStr = itemOrDate.date || itemOrDate.timeline || itemOrDate.isoDate || "";
  }

  if (!rawStr || typeof rawStr !== "string" || !rawStr.trim()) {
    return 0;
  }

  const text = rawStr.trim();
  const cleaned = text.replace(/(\d+)(st|nd|rd|th)/gi, "$1");

  let targetSegment = cleaned;
  if (/[-–—]|\bto\b/i.test(cleaned)) {
    const parts = cleaned.split(/[-–—]|\bto\b/i);
    const lastPart = parts[parts.length - 1].trim();
    const firstPart = parts[0].trim();
    const lastYearMatch = lastPart.match(/\b(19\d{2}|20\d{2})\b/);
    const firstYearMatch = firstPart.match(/\b(19\d{2}|20\d{2})\b/);
    if (lastYearMatch) {
      targetSegment = lastPart;
    } else if (firstYearMatch) {
      targetSegment = `${lastPart} ${firstYearMatch[1]}`;
    }
  }

  const pipeIndex = targetSegment.indexOf("|");
  if (pipeIndex !== -1) {
    targetSegment = targetSegment.substring(0, pipeIndex).trim();
  }

  const lower = targetSegment.toLowerCase();

  if (lower.includes("present") || lower.includes("current") || lower.includes("ongoing")) {
    return new Date().getTime();
  }

  if (lower.includes("discovery")) {
    return new Date(2023, 0, 1).getTime();
  }

  const yearMatch = targetSegment.match(/\b(19\d{2}|20\d{2})\b/) || cleaned.match(/\b(19\d{2}|20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

  const monthsMap = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sept: 8, sep: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };

  let month = 0;
  let foundMonth = false;

  for (const [mName, mIdx] of Object.entries(monthsMap)) {
    const mRegex = new RegExp(`\\b${mName}\\b`, "i");
    if (mRegex.test(targetSegment) || mRegex.test(cleaned)) {
      month = mIdx;
      foundMonth = true;
      break;
    }
  }

  let day = 1;
  const dayMatches = targetSegment.match(/\b([1-9]|[12]\d|3[01])\b/g);
  if (dayMatches) {
    for (const d of dayMatches) {
      const num = parseInt(d, 10);
      if (num !== year && num >= 1 && num <= 31) {
        day = num;
        break;
      }
    }
  }

  if (year !== null) {
    return new Date(year, month, day).getTime();
  }

  if (foundMonth) {
    return new Date(2025, month, day).getTime();
  }

  const directTimestamp = Date.parse(text);
  if (!isNaN(directTimestamp)) {
    return directTimestamp;
  }

  return 0;
};

export const toggleEventVisibility = async (id, isVisible) => {
  if (!db) throw new Error("Database not connected");
  const eventRef = doc(db, "events", id);
  return await updateDoc(eventRef, {
    visible: isVisible,
    updatedAt: serverTimestamp()
  });
};

export const setEventsSectionSetting = async (showSection) => {
  if (!db) throw new Error("Database not connected");
  const configRef = doc(db, "events", "_settings");
  return await setDoc(configRef, {
    showEventsSection: showSection,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// CRUD Operations for Milestones
export const addMilestone = async (milestoneData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "milestones"), {
    ...milestoneData,
    order: Number(milestoneData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateMilestone = async (id, milestoneData) => {
  if (!db) throw new Error("Database not connected");
  const milestoneRef = doc(db, "milestones", id);
  return await updateDoc(milestoneRef, {
    ...milestoneData,
    updatedAt: serverTimestamp()
  });
};

export const deleteMilestone = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "milestones", id));
};

// CRUD Operations for Certifications
export const addCertification = async (certData) => {
  if (!db) throw new Error("Database not connected");
  return await addDoc(collection(db, "certifications"), {
    ...certData,
    order: Number(certData.order) || Date.now(),
    createdAt: serverTimestamp()
  });
};

export const updateCertification = async (id, certData) => {
  if (!db) throw new Error("Database not connected");
  const certRef = doc(db, "certifications", id);
  return await updateDoc(certRef, {
    ...certData,
    updatedAt: serverTimestamp()
  });
};

export const deleteCertification = async (id) => {
  if (!db) throw new Error("Database not connected");
  return await deleteDoc(doc(db, "certifications", id));
};

// Seed Firestore with initial portfolio data
export const seedInitialPortfolioData = async () => {
  if (!db) throw new Error("Database not connected");

  // Check if projects exist
  const projectsSnap = await getDocs(collection(db, "projects"));
  if (projectsSnap.empty) {
    for (const proj of defaultProjects) {
      await addDoc(collection(db, "projects"), {
        ...proj,
        createdAt: serverTimestamp()
      });
    }
  }

  // Check if events exist
  const eventsSnap = await getDocs(collection(db, "events"));
  if (eventsSnap.empty) {
    for (const evt of defaultEvents) {
      await addDoc(collection(db, "events"), {
        ...evt,
        createdAt: serverTimestamp()
      });
    }
  }

  // Check if milestones exist
  const milestonesSnap = await getDocs(collection(db, "milestones"));
  if (milestonesSnap.empty) {
    for (const ms of defaultMilestones) {
      await addDoc(collection(db, "milestones"), {
        ...ms,
        createdAt: serverTimestamp()
      });
    }
  }

  return true;
};
