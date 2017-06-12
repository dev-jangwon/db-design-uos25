/**
 * Created by jangwon on 2017. 6. 11..
 */
var dialog = {
    modal: null,
    init: function(id) {
        this.modal = $('#' + id);
    },

    show: function(item, callback) {
        for (var key in item) {
            $('#' + key).val(item[key]);
        }

        this.modal.modal('show');

        if (callback && typeof callback == 'function') {
            this.modal.off('hidden.bs.modal');
            this.modal.on('hidden.bs.modal', function (e) {
                callback();
            });
        }
    }
};
