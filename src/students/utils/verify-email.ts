import { validate } from 'deep-email-validator';

// function to verify if the email addres is valid accross different criteria
const verifyEmail = async (email: string) => {
  try {
    const res = await validate(email);
    // Check if the result has a reason.
    if (res.reason) {
      console.log(res.reason);
      // If the email is not valid, return false
      return false;
    }
    return true;
  } catch (error) {
    // Throw a new Error if something goes wrong
    throw new Error(error);
  }
};

export default verifyEmail;
