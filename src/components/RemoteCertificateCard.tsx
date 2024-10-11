import React, { useState } from "react";
import { useCertificateStore } from "../store";
export const RemoteCertificateCard = () => {

  return (
    <div>
      <pre>
        {JSON.stringify(useCertificateStore.getState().remoteCertificates, null, 2)}
      </pre>
    </div>
  );
};
