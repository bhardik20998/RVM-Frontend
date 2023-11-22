import { backendaddress } from "../constant";

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>;
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>;

export const postApi = async (address, data, content_type, process_data) => {
  try {
    const response = await fetch(backendaddress + address, {
      method: "POST",
      headers: {
        "Content-Type": content_type,
      },
      body: data,
      // Add other options as needed
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getApi = async (address, content_type) => {
  try {
    const response = await fetch(backendaddress + address, {
      method: "GET",
      headers: {
        "Content-Type": content_type,
      },
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export function getUniqueCities(data, filter) {
  const uniqueCities = [];

  for (let i = 0; i < data.length; i++) {
    const city = data[i][filter];

    // Check if the city is not already in the uniqueCities array
    if (!uniqueCities.includes(city)) {
      uniqueCities.push(city);
    }
  }

  return createObjectWithArray(uniqueCities.sort());
}

export function createObjectWithArray(values) {
  const obj = { value: [] };

  if (Array.isArray(values)) {
    obj.value = values.map((value) => ({
      value: value,
      label: capitalizeFirstLetterOfWord(value),
    }));
  }

  return obj.value;
}

export function capitalizeFirstLetterOfWord(word) {
  if (typeof word !== "string" || word.length === 0) {
    return word;
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function containsOnlyNumbers(inputString) {
  // Use a regular expression to check if the string contains only numbers
  return /^[\d,]+$/.test(inputString);
}
