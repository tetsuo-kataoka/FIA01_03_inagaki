import React, { useState, createContext, useEffect } from "react";

// Contextオブジェクトを作成し、exportする
export const CommonContext = createContext();

const CommonContextProvider = ({ children }) => {
  const value = {
    getList,
  };

  return (
    // Providerで子コンポーネントをラップする
    // valueに子コンポーネントで使いたい変数や関数を与える
    <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
  );
};

export default CommonContextProvider;
