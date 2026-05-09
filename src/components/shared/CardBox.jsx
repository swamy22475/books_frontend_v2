import React from "react";
import { Card } from "../ui/card";





const CardBox = ({ children, className }) => {
  return (
    <Card className={`card no-inset no-ring ${className} shadow-none border border-ld rounded-lg w-full`}>
      {children}
    </Card>);


};
export default CardBox;