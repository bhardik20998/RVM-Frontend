import React, { useEffect } from 'react';

const NumberInput = () => {
  const handleKeyPress = (e) => {
    let charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  const formatInput = (value) => {
    const number = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(number)) {
      return '₹ ' + number.toLocaleString('en-IN');
    } else {
      return value;
    }
  };

  const handleKeyUp = (e) => {
    e.target.value = formatInput(e.target.value);
  };

  useEffect(() => {
    document.getElementById('input-price').focus();
  }, []);

  return (
    <input
      type="text"
      className="just-number"
      id="input-price"
      onKeyPress={handleKeyPress}
      onKeyUp={handleKeyUp}
    />
  );
};

export default NumberInput;
