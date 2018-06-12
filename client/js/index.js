var app = new Vue({
    el: '#app',
    data: {
        userName: '',
        message: 'Привет, Vue!',
        userNameWasChecked: false,
        checkingUserName: false,
        correctUserName: false,
        bufferedPlayer: null,
        players: [
            // {
            //     steamid: "76561197993331235",
            //     communityvisibilitystate: 3,
            //     profilestate: 1,
            //     personaname: "Valion",
            //     lastlogoff: 1528343227,
            //     profileurl: "https://steamcommunity.com/id/gwellir/",
            //     avatar: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/db/db7cc7c5f0c3d80d5bd5bb3df300b8c76889e9a0.jpg",
            //     avatarmedium: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/db/db7cc7c5f0c3d80d5bd5bb3df300b8c76889e9a0_medium.jpg",
            //     avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/db/db7cc7c5f0c3d80d5bd5bb3df300b8c76889e9a0_full.jpg",
            //     personastate: 3,
            //     realname: "Vlad",
            //     primaryclanid: "103582791429625718",
            //     timecreated: 1192371778,
            //     personastateflags: 0,
            //     gameextrainfo: "Kindred Spirits on the Roof",
            //     gameid: "402620",
            // },
            // {
            //     steamid: "76561198081942812",
            //     communityvisibilitystate: 3,
            //     profilestate: 1,
            //     personaname: "Moto",
            //     lastlogoff: 1528319659,
            //     profileurl: "https://steamcommunity.com/id/molotoko/",
            //     avatar: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f00f53a06b6d5066a5a93d2c00bcb9106ac90ec.jpg",
            //     avatarmedium: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f00f53a06b6d5066a5a93d2c00bcb9106ac90ec_medium.jpg",
            //     avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f00f53a06b6d5066a5a93d2c00bcb9106ac90ec_full.jpg",
            //     personastate: 0,
            //     realname: "Elezavetta",
            //     primaryclanid: "103582791432934273",
            //     timecreated: 1358703646,
            //     personastateflags: 0
            // },
        ],
        commonGames: [],
    },
    watch: {
        userName: function(token, prev) {
            this.clean();

            if (this.userNameTimer) {
                clearTimeout(this.userNameTimer);
                this.userNameTimer = null;
            }

            const flag = this.checkIfAdded();
            console.log('flag', flag);
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
            }, 750);
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
            console.log('REQUEST', `/user/${name}`);
            fetch(`/user/${name}`)
                .then(res => res.json())
                .then(res => {
                    vm.checkingUserName = false;
                    console.log('res', res);
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
        onClick: function() {
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
            console.log('onPlayerCrossClick', id);
            this.players = this.players.filter(player => player.steamid !== id);
        },
        getCommonGames: function() {
            const query = this.players.map(player => player.steamid).join(',');
            fetch(`/get-common/?user_ids=${query}`)
                .then(res => res.json())
                .then((res) => {
                    console.log('res', res);
                    this.commonGames = res;
                });
        },
        checkIfAdded: function() {
            return Boolean(this.players.find(player => player.nickname === this.userName));
        }
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
