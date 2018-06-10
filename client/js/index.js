var app = new Vue({
    el: '#app',
    data: {
        message: 'Привет, Vue!'
    },
    methods: {
        checkName: () => {
            fetch();
        },
    }
});
