export const subscriptionStorage = 'subscriptions';
export const favouriteStorage = 'favouriteUniversities';

export const getFromStorage = (storageKey: string) => {
  const stringifiedValue = localStorage.getItem(storageKey);
  if (stringifiedValue) {
    return JSON.parse(stringifiedValue);
  }
  return [];
}

export const setIntoStorage = (storageKey: string, value: any[]) => {
  const stringifiedValue = JSON.stringify(value);
  localStorage.setItem(storageKey, stringifiedValue)
}