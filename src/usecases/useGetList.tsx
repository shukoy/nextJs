
export const selectDatabase = async () => {  
  const response = await fetch('http://localhost:8080/task/list', {
    method: 'GET',
    headers: {
            'Content-Type': 'application/json',
    },
  })
  if (response.ok) {
    const responseData = await response.json();
    return responseData;
  }
}