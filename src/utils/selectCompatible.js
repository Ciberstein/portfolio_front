const selectCompatible = (obj, value, label, img = null) => {
  let array = [];

  obj.map((item) => {
    const newItem = {
      label: item[label],
      value: item[value],
    };

    if (img) {
      const dynamicFields = img.match(/%\w+%/g);

      let imgProcessed = img;

      if (dynamicFields) {
        dynamicFields.forEach((field) => {
          const fieldName = field.replace(/%/g, "");
          if (item[fieldName] !== undefined) {
            imgProcessed = imgProcessed.replace(field, item[fieldName]);
          }
        });
      }
      newItem.img = imgProcessed;
    }

    array.push(newItem);
  });

  return array;
};

export default selectCompatible;
