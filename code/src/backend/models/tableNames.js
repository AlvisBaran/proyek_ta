export const configName = {
  USER: "users",
  CATEGORY: "categories",
  CONTENT: "users/$/contents",
  MEMBERSHIP: "users/$/memberships",
  ACCOUNTUPGRADEREQUEST: "account_upgrade_requests",
}

export const convertPath = (configName, [...args] = []) => {
  if (configName?.length <= 0) return false;
  let argsCounter = 0;

  let slots = configName?.split("/");
  // console.info(slots); return true;
  // if (slots?.length === 1) return configName;
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (slot === "$" && args.length > argsCounter) {
      slots[i] = args[argsCounter];
      argsCounter++;
    }
  }

  let result = "";
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    result += slot;
    if (i < slots.length-1) result += "/"; 
  }

  return result;
}

