const getCommandEntry = ({ entryId, propertyAlias, value }) => ({
  entryId,
  propertyAlias,
  propertyValues: [
    {
      value: { doubleValue: value },
      timestamp: { timeInSeconds: Date.now() / 1000 },
    },
  ],
});

export default getCommandEntry;
