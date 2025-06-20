import React, { useEffect, useState } from "react";


function Test() {
  const [name, setName] = useState("Waiting for data ...");

  useEffect(() => {
    var source = new EventSource("http://20.84.108.109/events");
    source.addEventListener(
      "customer",
      function(event) {
        var data = JSON.parse(event.data);
        setName(data[0].name);
      },
      false
    );
    source.addEventListener(
      "error",
      function(event) {
        console.log(event);
      },
      false
    );
  });
  return (
    <div
      style={{
        fontSize: "2rem",
        padding: "2rem 0rem 0rem 2rem",
        color: "black",
      }}
    >
      Name: {name}
    </div>
  );
}

export default Test;