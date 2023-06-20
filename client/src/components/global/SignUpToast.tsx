import React, { useEffect, useState } from 'react';

interface SuccessToastProps {
  message: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {visible && (
        <div className="toast bg-success text-white">
          <div className="toast-body">
            {message}
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessToast;