
export const parseSpintax = (text: string): string => {
  const spintaxRegex = /\{([^{}]+)\}/;
  let match;
  while ((match = spintaxRegex.exec(text)) !== null) {
    const choices = match[1].split('|');
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    text = text.replace(match[0], randomChoice);
  }
  return text;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
