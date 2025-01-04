import { useState, useEffect } from 'react';
import Product from './Types/Product';
import { ProductService } from './api/shopifyAPIService';

function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    const itemString = localStorage.getItem("wishlist");
    return [...(itemString? JSON.parse(itemString) : []), 9689001328933, 9658662584613];
  });
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    // Update local storage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    // Convert wish list product ids into products
    const fetchProducts = async () => {
      const fetchedProducts = await Promise.all(
        wishlist.map(async (wishlistId:string|number) => {
          return await ProductService.getProductById(wishlistId);
        })
      );
      return fetchedProducts;
    };

    fetchProducts().then((result) => {
      setProductList(result);
    })

  }, [wishlist]);

  const addItemsToWishlist = (itemIds: (string|number)[]) => {
    for(const itemId of itemIds){
      if(!wishlist.find((wishlistItemId:string|number) => {return wishlistItemId === itemId})){
        setWishlist([...wishlist, itemId]);
      }
    }
  };

  const removeItemsFromWishlist = (itemIds: (string|number)[]) => {
    setWishlist(wishlist.filter((wishlistItemId:string|number) => {return !itemIds.find((itemId) => {return wishlistItemId === itemId})}));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return {wishlist, productList, addItemsToWishlist, removeItemsFromWishlist, clearWishlist};
}

export default useWishlist;