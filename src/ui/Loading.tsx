import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(95,193,201,0.5)",
        color: "#39115b",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontStyle: "italic",
        top: 0,
        left: 0,
      }}
    >
      Loading...
    </div>
  );
};

export default Loading;
