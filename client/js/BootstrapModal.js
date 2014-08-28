/** @jsx React.DOM */

var BootstrapModal = React.createClass({
    // The following two methods are the only places we need to
    // integrate with Bootstrap or jQuery!
    componentDidMount: function() {
        // When the component is added, turn it into a modal
        $(this.getDOMNode())
            .modal({backdrop: 'static', keyboard: false, show: false})
    },
    componentWillUnmount: function() {
        $(this.getDOMNode()).off('hidden', this.handleHidden);
    },
    close: function() {
        $(this.getDOMNode()).modal('hide');
    },
    open: function() {
        $(this.getDOMNode()).modal('show');
    },
    render: function() {
        var confirmButton = null;
        var cancelButton = null;

        if (this.props.confirm) {
            confirmButton = (
                <BootstrapButton
                onClick={this.handleConfirm}
                className="btn-primary">
          {this.props.confirm}
                </BootstrapButton>
                );
        }
        if (this.props.cancel) {
            cancelButton = (
                <BootstrapButton onClick={this.handleCancel}>
          {this.props.cancel}
                </BootstrapButton>
                );
        }
        return (
            <div className="modal hide fade">
                <div className="modal-header">
                    <button
                    type="button"
                    className="close"
                    onClick={this.handleCancel}
                    dangerouslySetInnerHTML={{__html: '&times'}}
                    />
                    <h3>{this.props.title}</h3>
                </div>
                <div className="modal-body">
          {this.props.children}
                </div>
                <div className="modal-footer">
          {cancelButton}
          {confirmButton}
                </div>
            </div>
            );
    },
    handleCancel: function() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },
    handleConfirm: function() {
        if (this.props.onConfirm) {
            this.props.onConfirm();
        }
    }
});