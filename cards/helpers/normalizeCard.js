const generateBizNumber = require("./generateBizNumber");

const normalizeCard = async (rawCard, userId) => {
    const { url, alt } = rawCard.image;
    const image = {
        url:
            url ||
            "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
        alt: alt || "Business card image",
    };

    const normalizedCard = {
        ...rawCard,
        image,
        address: {
            ...rawCard.address,
            state: rawCard.address.state || "",
        },
        bizNumber: rawCard.bizNumber || (await generateBizNumber()),
    };

    if (userId && userId !== "") normalizedCard.user_id = userId;

    return normalizedCard;
};

module.exports = normalizeCard;
