let RegisterVariable = {
    create: function (value) {

        return {
            value: value,

            set: function (value) {
                this.value = value;
            },

            setLocal: function (value) {
                let origValue = this.value;
                this.value = value;
                if (this.value !== origValue) {
                    this.observer.callback(this.value);    
                }
            },

            get: function () {
                this.observer.callback(this.value);
            }
        };
    }
};
