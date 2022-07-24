import { useState, useEffect } from 'react';

export const Answer = () => {
  //1.useState を準備して、データを取得出来るようにする
  const [data, setData] = useState([
    {
      id: "",
      title: "",
      explanation: "",
      question: "",
    }
  ]);

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        1
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
        <DialogTitle id="form-dialog-title">
          {questions[1]}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="standard-multiline-static"
            label="回答"
            multiline
            rows={4}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            value={note}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
  