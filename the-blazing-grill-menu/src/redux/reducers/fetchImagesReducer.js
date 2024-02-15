import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../database/config";
import { FETCH_IMAGES_STATE } from "../constants";
const initialState = [];
export const fetchImagesReducer = async (state = initialState, action) => {
  switch (action.type) {
    case FETCH_IMAGES_STATE:
      try {
        const imagesRef = ref(storage, "files"); // Replace 'images' with your storage path

        // List all items in the images folder
        const imageList = await listAll(imagesRef);

        // Get download URLs for all images
        const urls = await Promise.all(
          imageList.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return url;
          })
        );

        return urls;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
      break;
    default:
      return state;
  }
};
// fetchImages();
