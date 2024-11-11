export default {
  title: "Components/PDF",
  parameters: {
    docs: {
      description: {
        component: "The pdf component is used to display a pdf.",
      },
    },
  },
};

// Twig file.
import pdfTemplate from "./pdf.twig";

// CSS file.
import "./pdf.css";

import "./pdfjs/build/pdf.min.js";
import "./pdfjs/build/pdf.worker.min.js";
import "./printjs/print.min.js";
import "./pdf.stories.inc.js";

// Yml file.
import pdfData from "./pdf.component.yml";

import pdfFile from "./lorem_ipsum.pdf";

const toDefaultValues = (obj) => {
  let output = {};
  for (let prop in obj) {
    // If the property is an object itself, call the function recursively
    if (typeof obj[prop] === "object" && obj[prop] !== null) {
      output[prop] = toDefaultValues(obj[prop]);
    } else {
      // Else, assign the property value as it is
      output[prop] = obj[prop];
    }

    // If the property has a 'default' property, assign its value to the main property
    if (obj[prop] && typeof obj[prop] === "object" && "default" in obj[prop]) {
      output[prop] = obj[prop].default;
    }
    output["pdf_url"] = pdfFile;
  }

  return output;
};

export const Default = () => {
  return pdfTemplate({
    ...toDefaultValues(pdfData.props.properties),
  });
};
