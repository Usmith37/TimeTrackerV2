package errors

import "errors"

var (
	ErrShiftAlreadyStarted = errors.New("У вас уже есть незавершенная смена")
	ErrNoStartedShift      = errors.New("У вас еще нет начатых смен")
)
