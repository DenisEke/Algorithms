
module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: {
                    darker: "#154D00",
                    DEFAULT: "#8BBF56",
                    lighter: "#668C3F",
                    lightest: "#A0BF80",
                    background:"#F6FBEE"
                },
                warning: "#F9CB6D",
                "warning-darker": "#F9CB6D",
                error: "#F56A48",
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
