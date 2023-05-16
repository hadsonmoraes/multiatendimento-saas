import React, { useState, /*useEffect,*/ useContext } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
// import ContactModal from "../ContactModal";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  autoComplete: {
    width: 300,
    // marginBottom: 20 
  },
  maxWidth: {
    width: "100%",
  },
  buttonColorError: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}));

// const filter = createFilterOptions({
//   trim: true,
// });

const selectQueuecontactsModal = ({ modalOpen, onClose }) => {
  const history = useHistory();

  // const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [searchParam, setSearchParam] = useState("");
  // const [selectedContact, setSelectedContact] = useState(null);
  // const [newContact, setNewContact] = useState({});
  // const [contactModalOpen, setContactModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [selectedQueue, setSelectedQueue] = useState('');
  const classes = useStyles();

  // useEffect(() => {
  //   if (!modalOpen || searchParam.length < 3) {
  //     setLoading(false);
  //     return;
  //   }
  //   setLoading(true);
  //   const delayDebounceFn = setTimeout(() => {
  //     const fetchContacts = async () => {
  //       try {
  //         const { data } = await api.get("contacts", {
  //           params: { searchParam },
  //         });
  //         setOptions(data.contacts);
  //         setLoading(false);
  //       } catch (err) {
  //         setLoading(false);
  //         toastError(err);
  //       }
  //     };

  //     fetchContacts();
  //   }, 500);
  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchParam, modalOpen]);

  const handleClose = () => {
    onClose();
    // setSearchParam("");
    // setSelectedContact(null);
    setSelectedQueue("");
  };

  const handleSaveTicket = async contactId => {
    if (!contactId) return;
    setLoading(true);
    try {
      const { data: ticket } = await api.post("/tickets", {
        contactId: contactId,
        userId: user.id,
        status: "open",
        queueId: selectedQueue || null,
      });
      history.push(`/tickets/${ticket.id}`);
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
    handleClose();
  };

  // const handleSelectOption = (e, newValue) => {
  //   if (newValue?.number) {
  //     setSelectedContact(newValue);
  //   }
  //   else if (newValue == null) {  // 
  //     setSelectedContact(null);
  //     // setSelectedQueue('');
  //   }
  //   else if (newValue?.name) {
  //     setNewContact({ name: newValue.name });
  //     setContactModalOpen(true);
  //   }
  // };

  // const handleCloseContactModal = () => {
  //   setContactModalOpen(false);
  // };


  // const handleAddNewContactTicket = (contact) => {
  //   // handleSaveTicket(contact.id); //ao terminar o cadastro ele cria uma conversa.
  //   handleSelectOption(); // ao terminar o cadastro ele mostra a tela de novo atendimento.
  // };

  // const createAddContactOption = (filterOptions, params) => {
  //   const filtered = filter(filterOptions, params);

  //   if (params.inputValue !== "" && !loading && searchParam.length >= 3) {
  //     filtered.push({
  //       name: `${params.inputValue}`,
  //     });
  //   }

  //   return filtered;
  // };

  // const renderOption = option => {
  //   if (option.number) {
  //     return `${option.name} - ${option.number}`;
  //   } else {
  //     return `${i18n.t("newTicketModal.add")} ${option.name}`;
  //   }
  // };

  // const renderOptionLabel = option => {
  //   if (option.number) {
  //     return `${option.name} - ${option.number}`;
  //   } else {
  //     // return `${option.name}`;
  //     return setSelectedContact(null); //apos criar novo contato ele zera o campo pesquisar contato
  //   }
  // };

  return (
    <>
      {/* <ContactModal
        open={contactModalOpen}
        initialValues={newContact}
        onClose={handleCloseContactModal}
        onSave={handleAddNewContactTicket}
      ></ContactModal> */}
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle style={{ color: '#29759A', textAlign: 'center' }} id="form-dialog-title">
          {i18n.t("newTicketModal.title")}
        </DialogTitle>
        <FormControl>
          <DialogContent dividers>
            <DialogContent />
            <FormControl variant="outlined" className={classes.maxWidth}>
              <InputLabel>{i18n.t("Selecione um Setor")}</InputLabel>
              <Select
                value={selectedQueue}
                onChange={(e) => setSelectedQueue(e.target.value)}
                label={i18n.t("Selecione um Setor")}
              >
                <MenuItem value={''}>&nbsp;</MenuItem>
                {user.queues.map((queue) => (
                  <MenuItem key={queue.id} value={queue.id}>{queue.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
        </FormControl>
        <DialogActions style={{ color: '#29759A', textAlign: 'center', justifyContent: 'center' }}>
          <Button
            onClick={handleClose}
            color="secondary"
            disabled={loading}
            variant="outlined"
          >
            {i18n.t("newTicketModal.buttons.cancel")}
          </Button>
          <ButtonWithSpinner
            variant="contained"
            type="button"
            disabled={!selectedQueue}
            onClick={() => handleSaveTicket(selectedQueue)}
            color="primary"
            loading={loading}
          >
            {i18n.t("newTicketModal.buttons.ok")}
          </ButtonWithSpinner>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default selectQueuecontactsModal;
