package integration

type EmployeesClient struct{}

func NewEmployeesClient() *EmployeesClient {
	return &EmployeesClient{}
}

func (c *EmployeesClient) GetEmployeeById(keycloakId string) (*EmployeeIdDto, error) {
	return &EmployeeIdDto{
		StuffId:    100,
		KeycloakId: keycloakId,
	}, nil
}
