export async function fetchStocks(token) {
  const response = await fetch("http://localhost:8000/stock", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.json();
}

export async function fetchPortfolios(token) {
  const response = await fetch("http://localhost:8000/portfolio/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.json();
}

export async function fetchPortfolio(id, token) {
  const response = await fetch(`http://localhost:8000/portfolio/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.json();
}

export async function fetchPortfolioStocks(id, token) {
  const response = await fetch(`http://localhost:8000/${id}/stocks/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.json();
}

export async function fetchAllIdealEMAs(id, token) {
  const response = await fetch(
    `http://localhost:8000/${id}/all_highest_emas/`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.json();
}

export async function fetchExcelData(id, token) {
  const response = await fetch(
    `http://localhost:8000/${id}/stocks_excel_export/`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.json();
}

export async function updateAllStocks(token) {
  const response = await fetch(`http://localhost:8000/update_all_stocks/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function fetchStock(id, token) {
  const response = await fetch(`http://localhost:8000/stock/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.json();
}

export async function fetchIdealEMA(id, token) {
  const response = await fetch(
    `http://localhost:8000/${id}/highest_profit_ema`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.json();
}

export async function fetchAllEMAs(id, token) {
  const response = await fetch(`http://localhost:8000/${id}/all_ema_periods`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.json();
}

export async function deleteStock(idToken) {
  const response = await fetch(`http://localhost:8000/stock/${idToken.id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${idToken.token}`,
    },
  });
  return response.json();
}

export async function deletePortfolio(idToken) {
  const response = await fetch(
    `http://localhost:8000/portfolio/${idToken.id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${idToken.token}`,
      },
    }
  );
  return response.json();
}

export async function fetchEMA(id, token) {
  if (id) {
    const response = await fetch(`http://localhost:8000/ema/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.json();
  } else {
    return null;
  }
}

export async function addStock(bodyToken) {
  const stockBody = bodyToken.body;
  const token = bodyToken.token;
  const response = await fetch(`http://localhost:8000/stock/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stockBody),
  });
  return response.json();
}

export async function addPortfolio(bodyToken) {
  const portfolioBody = bodyToken.body;
  const token = bodyToken.token;
  const response = await fetch(`http://localhost:8000/portfolio/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(portfolioBody),
  });
  return response.json();
}

export async function loginUser(body) {
  const response = await fetch(`http://localhost:8000/api-token-auth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}
