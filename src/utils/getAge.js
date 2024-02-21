const getAge = (date) => {
  const actualDate = new Date();
  const bornDate = new Date(date);

  let age = actualDate.getFullYear() - bornDate.getFullYear();

  if (
    bornDate.getMonth() > actualDate.getMonth() ||
    (bornDate.getMonth() === actualDate.getMonth() &&
      bornDate.getDate() > actualDate.getDate())
  ) {
    age--;
  }

  return age;
};

export default getAge;
