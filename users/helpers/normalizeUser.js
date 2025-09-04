const normalizeUser = (rawUser) => {
    const { url, alt } = rawUser.image;
    const image = {
        url:
            url ||
            "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
        alt: alt || "Business card image",
    };

    const name = {
        ...rawUser.name,
        middle: rawUser.name.middle || "",
    };

    const address = {
        ...rawUser.address,
        state: rawUser.address.state || "not defined",
    };

    const user = {
        ...rawUser,
        name,
        image,
        address,
    };

    return user;
};

module.exports = normalizeUser;
