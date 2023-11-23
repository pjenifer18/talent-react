import { Button, Modal } from "semantic-ui-react";

function CustomModal({
  modalTitle,
  ModalBody,
  onClose,
  onSubmit,
  show,
  error,
  currentModalView,
}) {
  return (
    <Modal onClose={onClose} open={show} size="tiny">
      <Modal.Header>{modalTitle}</Modal.Header>
      <Modal.Content>
        {error && <p className="text-danger">*{error}</p>}
        <Modal.Description>{ModalBody()}</Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button color="black" onClick={onClose}>
          Cancel
        </Button>
        <Button
          content={
            currentModalView === "delete"
              ? "Delete"
              : currentModalView === "edit"
              ? "Edit"
              : "Create"
          }
          labelPosition="right"
          icon={currentModalView === "delete" ? "delete" : "checkmark"}
          onClick={onSubmit}
          positive={currentModalView === "add" || currentModalView === "edit"}
          negative={currentModalView === "delete"}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default CustomModal;
