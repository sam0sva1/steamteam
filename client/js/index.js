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
        commonGames: [
            {
                appid: 360,
                name: "Half-Life Deathmatch: Source",
                genre: "Action",
                img_logo_url: "9a5b7119d4e8977fffcd370d3c24036be7cee904"
            },
            // {"appid":4000,"name":"Garry's Mod","genre":"Indie, Simulation","img_logo_url":"93c9364c3942223ab66195182fe1982af8a16584"},
            // {"appid":220,"name":"Half-Life 2","genre":"Action","img_logo_url":"e4ad9cf1b7dc8475c1118625daf9abd4bdcbcad0"},
            // {"appid":320,"name":"Half-Life 2: Deathmatch","genre":"Action","img_logo_url":"6dd9f66771300f2252d411e50739a1ceae9e5b30"},
            // {"appid":340,"name":"Half-Life 2: Lost Coast","genre":"Action","img_logo_url":"867cce5c4f37d5ed4aeffb57c60e220ddffe4134"},
            // {"appid":420,"name":"Half-Life 2: Episode Two","genre":"Action","img_logo_url":"553e6a2e7a469dcbaada729baa1f5fd7764668df"},
            // {"appid":13210,"name":"Unreal Tournament 3: Black Edition","genre":"Action","img_logo_url":"ba0a5c14642ab3337bf09d1d3df5e076a771ee32"},
            // {"appid":21690,"name":"Resident Evil 5 / Biohazard 5","genre":"Action, Adventure","img_logo_url":"e277ab70fff98bb2300a39bf8e2371a746fe50b1"},
            // {"appid":550,"name":"Left 4 Dead 2","genre":"Action","img_logo_url":"205863cc21e751a576d6fff851984b3170684142"},
            // {"appid":8930,"name":"Sid Meier's Civilization V","genre":"Strategy","img_logo_url":"2203f62bd1bdc75c286c13534e50f22e3bd5bb58"},
            // {"appid":8980,"name":"Borderlands","genre":"Action, RPG","img_logo_url":"88ec298ff1ff0d748df39e084892aed6e919b146"},
            // {"appid":42910,"name":"Magicka","genre":"Action, RPG","img_logo_url":"8c59c674ef40f59c3bafde8ff0d59b7994c66477"},
            // {"appid":620,"name":"Portal 2","genre":"Action, Adventure","img_logo_url":"d2a1119ddc202fab81d9b87048f495cbd6377502"},
        ],
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
            }, 700);
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
            fetch(`/user/${name}`)
                .then(res => {
                    if (res.status !== 200) {
                        this.checkingUserName = false;
                        this.userNameWasChecked = true;
                        this.correctUserName = false;
                    }

                    return res;
                })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        this.bufferedPlayer = res.player;
                        this.correctUserName = true;
                    } else {
                        this.correctUserName = false;
                    }

                    this.checkingUserName = false;
                    this.userNameWasChecked = true;
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
            if (this.checkingUserName) {
                return 'sidebar__cross_active';
            }
            if (this.userNameWasChecked) {
                return `sidebar__cross_${(this.correctUserName && !this.checkIfAdded()) ? 'correct' : 'wrong'}`;
            }
            return '';
        },
      }
});
