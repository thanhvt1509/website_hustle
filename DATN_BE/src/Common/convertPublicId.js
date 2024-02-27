export const getPublicIdFromUrl = (url, regex) => {
    
    console.log(regex);
    const match = url.match(regex)
    console.log(match);
    return match ? match[1] : null;
  };
  
