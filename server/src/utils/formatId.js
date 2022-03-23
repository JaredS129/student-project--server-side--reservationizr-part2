const formatId = (resourceEntry) => {
  Object.assign(resourceEntry, { id: resourceEntry._id });

  delete resourceEntry._id;

  return {
    ...resourceEntry,
  };
};

module.exports = formatId;
