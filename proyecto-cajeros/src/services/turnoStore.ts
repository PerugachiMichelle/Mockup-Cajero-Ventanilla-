const KEY = "codigoTurnoActivo";

export function setCodigoTurnoActivo(codigo: string) {
  localStorage.setItem(KEY, codigo);
}

export function getCodigoTurnoActivo(): string | null {
  return localStorage.getItem(KEY);
}

export function clearCodigoTurnoActivo() {
  localStorage.removeItem(KEY);
}
