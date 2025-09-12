
// // import React, { createContext, useContext, useState ,useEffect} from "react";
// // import { addToCartApi, getCartApi } from "../services/userService";

// // const CartContext = createContext();

// // export function useCart() {
// //   return useContext(CartContext);
// // }

// // export function CartProvider({ children }) {
// //   const [cartItems, setCartItems] = useState([]);

// // useEffect(() => {
// //     const fetchCart = async () => {
// //       try {
// //         const data = await getCartApi(); 
// //         console.log("Fetched cart:", data);

// //         // ensure data is in correct format (array of products with quantity)
// //         setCartItems(data || []);
// //       } catch (err) {
// //         console.error("Failed to fetch cart:", err);
// //       }
// //     };
// //     fetchCart();
// //   }, []);

// // // const fetchCart = async () => {
// // //   try {
// // //     const data = await getCartApi();
// // //     console.log("Fetched cart:", data);

// // //     // agar data.items array hai
// // //     setCartItems(data.items || []);
// // //   } catch (err) {
// // //     console.error("Failed to fetch cart:", err);
// // //   }
// // // };




// //   const addToCart = async (product) => {
// //     try {
// //       // Call backend API
// //       await addToCartApi({ productId: product.id, quantity: 1 });

// //       // Update frontend state
// //       setCartItems((prev) => {
// //         const existing = prev.find((item) => item.id === product.id);
// //         if (existing) {
// //           return prev.map((item) =>
// //             item.id === product.id
// //               ? { ...item, quantity: item.quantity + 1 }
// //               : item
// //           );
// //         }
// //         return [...prev, { ...product, quantity: 1 }];
// //       });
// //     } catch (err) {
// //       console.error("Failed to add to cart:", err);
// //       alert("Failed to add product to cart"); // optional
// //     }
// //   };

// //   const removeFromCart = (id) => {
// //     setCartItems((prev) => prev.filter((item) => item.id !== id));
// //   };

// //   const updateQuantity = (id, quantity) => {
// //     setCartItems((prev) =>
// //       prev.map((item) =>
// //         item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
// //       )
// //     );
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // }


// import React, { createContext, useContext, useState, useEffect } from "react";
// import { addToCartApi, getCartApi } from "../services/userService";

// const CartContext = createContext();

// export function useCart() {
//   return useContext(CartContext);
// }

// export function CartProvider({ children }) {
//   const [cartItems, setCartItems] = useState([]);

//   // Fetch cart items from backend on mount
// useEffect(() => {
//   const fetchCart = async () => {
//     try {
//       const data = await getCartApi();
//       console.log("Fetched cart:", data);

//       const cartProducts = data[0]?.items || [];
//       setCartItems(cartProducts);
//     } catch (err) {
//       console.error("Failed to fetch cart:", err);
//     }
//   };

//   fetchCart();
// }, []);


   
//   const addToCart = async (product) => {
//     try {
//       await addToCartApi({ productId: product.id, quantity: 1 });

//       setCartItems((prev) => {
//         const existing = prev.find((item) => item.id === product.id);
//         if (existing) {
//           return prev.map((item) =>
//             item.id === product.id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           );
//         }
//         return [...prev, { ...product, quantity: 1 }];
//       });
//     } catch (err) {
//       console.error("Failed to add to cart:", err);
//       alert("Failed to add product to cart");
//     }
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id, quantity) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
//       )
//     );
//   };
// // 
  
//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }


// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { addToCartApi, getCartApi, removeCartItem, updateCartItem } from "../services/userService";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartApi();
        console.log("Fetched cart:", data);

        // Extract items array from first cart
        // const cartProducts = data[0]?.items || [];
        const cartProducts = Array.isArray(data[0]?.items) ? data[0].items : [];
        setCartItems(cartProducts);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, []);

  // Add to cart
  const addToCart = async (product) => {
    try {
      const response = await addToCartApi({ productId: product.id, quantity: 1 });
      console.log("Added to cart:", response);

      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add product to cart");
    }
  };

  // Remove item
  const removeFromCart = async (id) => {
    try {
      await removeCartItem(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Update quantity
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(id, quantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
