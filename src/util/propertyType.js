const PROPERTY_TYPE_LABELS = {
    SINGLE_FAMILY: 'Single Family',
    TOWNHOMES: 'Townhome',
};

const formatPropertyType = (type) => PROPERTY_TYPE_LABELS[type];

export { PROPERTY_TYPE_LABELS, formatPropertyType };
