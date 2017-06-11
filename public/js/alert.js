var alert = {
  modal: null,
  init: function(id) {
    this.modal = $('#' + id);
    // var margin_top = null;
    // this.modal.on('show.bs.modal', function() {
    //   margin_top = margin_top || parseFloat($(window).height()/2) - parseFloat($(this).find('.modal-dialog').height());
    //   $(this).find('.modal-dialog').css('margin-top', margin_top + 'px');
    // });
  },

  show: function(msg, callback) {
    this.modal.find('.modal-body p').text(msg);
    this.modal.modal('show');

    if (callback && typeof callback == 'function') {
      this.modal.off('hidden.bs.modal');
      this.modal.on('hidden.bs.modal', function (e) {
        callback();
      });
    }
  }
};
