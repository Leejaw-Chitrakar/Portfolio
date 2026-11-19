/**
 * ImgBB Image Upload Service
 * Uploads a binary file or base64 to ImgBB and returns the direct CDN image URL.
 */

export const uploadToImgBB = async (file) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey || apiKey === "your_imgbb_api_key_here") {
    throw new Error(
      "ImgBB API key is missing. Please add VITE_IMGBB_API_KEY to your .env file."
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result?.error?.message || "Failed to upload image to ImgBB."
    );
  }

  // Return the direct display URL
  return result.data.url;
};
