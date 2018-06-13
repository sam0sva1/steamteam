var app = new Vue({
    el: '#app',
    data: {
        userName: '',
        message: 'Привет, Vue!',
        userNameWasChecked: false,
        checkingUserName: false,
        correctUserName: false,
        bufferedPlayer: null,
        players: [],
        commonGames: [],
        commonGamesAreLoading: false,
    },
    watch: {
        userName: function(token, prev) {
            this.clean();

            if (this.userNameTimer) {
                clearTimeout(this.userNameTimer);
                this.userNameTimer = null;
            }

            const flag = this.checkIfAdded();
            if (flag) {
                this.userNameWasChecked = true;
                return;
            }

            const vm = this;
            this.userNameTimer = setTimeout(() => {
                const value = token.trim();
                if (value) {
                    vm.getUserByName(value);
                }
            }, 600);
        },
        players: function(players) {
            if (players.length > 1) {
                this.getCommonGames();
            } else {
                this.commonGames = [];
            }
        },
    },
    methods: {
        getUserByName: function(name) {
            this.checkingUserName = true;
            const vm = this;
            fetch(`/user/${name}`)
                .then(res => res.json())
                .then(res => {
                    vm.checkingUserName = false;
                    this.userNameWasChecked = true;
                    
                    if (res.success) {
                        this.bufferedPlayer = res.player;
                        vm.correctUserName = true;
                    } else {
                        vm.correctUserName = false;
                    }
                });
        },
        clean: function() {
            this.correctUserName = false;
            this.checkingUserName = false;
            this.userNameWasChecked = false;
            this.bufferedPlayer = null;
        },
        onPlusClick: function() {
            if (this.userNameWasChecked && this.correctUserName) {
                if (this.bufferedPlayer) {
                    const player = {
                        ...this.bufferedPlayer,
                        nickname: this.userName,
                    }
                    this.players.push(player);
                } else {
                    console.error('No user. Something went wrong!');
                }
            }
            this.userName = '';
            this.clean();
        },
        onPlayerCrossClick: function(id) {
            this.players = this.players.filter(player => player.steamid !== id);
        },
        getCommonGames: function() {
            const query = this.players.map(player => player.steamid).join(',');
            this.commonGamesAreLoading = true;
            fetch(`/games/common?user_ids=${query}`)
                .then(res => res.json())
                .then((res) => {
                    this.commonGames = res;
                    this.commonGamesAreLoading = false;
                });
        },
        checkIfAdded: function() {
            return Boolean(this.players.find(player => player.nickname === this.userName));
        },
        onEnterPress: function() {
            if (this.userNameWasChecked && this.correctUserName) {
                this.onPlusClick();
            }
        },
    },
    computed: {
        crossClasses: function() {
            if (this.userNameWasChecked) {
                return `sidebar__cross_${(this.correctUserName && !this.checkIfAdded()) ? 'correct' : 'wrong'}`;
            }
            return '';
        },
      }
});
