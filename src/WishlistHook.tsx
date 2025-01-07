import { useState, useEffect } from 'react';

function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    const itemString = localStorage.getItem("wishlist");
    try {
      return itemString ? JSON.parse(itemString) : []; // Use localStorage or an empty array
    } catch (error) {
      console.error("Error parsing wishlist from localStorage:", error);
      return []; // Fallback to an empty array if parsing fails
    }
  });

  useEffect(() => {
    // Update local storage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addItemsToWishlist = (itemIds: (number)[]) => {
    for (const itemId of itemIds) {
      if (!wishlist.find((wishlistItemId: number) => { return wishlistItemId === itemId })) {
        setWishlist([...wishlist, itemId]);
      }
    }
  };

  const removeItemsFromWishlist = (itemIds: (number)[]) => {
    setWishlist(wishlist.filter((wishlistItemId: number) => { return !itemIds.find((itemId) => { return wishlistItemId === itemId }) }));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return { wishlist, addItemsToWishlist, removeItemsFromWishlist, clearWishlist };
}

export default useWishlist;