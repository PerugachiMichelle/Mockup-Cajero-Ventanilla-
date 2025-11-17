

export type Denominacion = {
  billete: number;
  cantidad: number;
};

export interface AbrirTurnoRequest {
  codigoCaja: string;
  codigoCajero: string;
  contrasenia: string;
  montoInicial: number;
  denominacionesIniciales: Denominacion[];
}


export interface TransaccionRequest {
  codigoTurnoActivo: string;
  tipoTransaccion: "RETIRO" | "DEPOSITO";
  montoTotal: number;
  cuentaReferencia: string; 
  denominaciones: Denominacion[];
}

export interface CerrarTurnoRequest {
  codigoTurnoACerrar: string;
  montoFinal: number;
  denominacionesFinales: Denominacion[];
}


type ApiResponse<T = any> = T;


const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || "";

async function postJson<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await res.json().catch(() => null);
      let msg = json?.message || json?.error || `${res.status} ${res.statusText}`;
      if (json?.fieldErrors && typeof json.fieldErrors === "object") {
        const details = Object.entries(json.fieldErrors)
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join("; ");
        if (details) msg += ` — ${details}`;
      }
      throw new Error(msg);
    }
    const text = await res.text();
    throw new Error(`Error ${res.status} ${res.statusText}: ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return {} as ApiResponse<T>;
}

export async function abrirTurno(payload: AbrirTurnoRequest) {
  return postJson("/api/turnos/abrir", payload);
}

export async function registrarTransaccion(payload: TransaccionRequest) {
  return postJson("/api/transacciones", payload);
}

export async function cerrarTurno(payload: CerrarTurnoRequest) {

  const res = await fetch(`${API_BASE}/api/turnos/cerrar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await res.json().catch(() => null);
      let msg = json?.message || json?.error || `${res.status} ${res.statusText}`;
      if (json?.fieldErrors && typeof json.fieldErrors === "object") {
        const details = Object.entries(json.fieldErrors)
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join("; ");
        if (details) msg += ` — ${details}`;
      }
      throw new Error(msg);
    }
    const text = await res.text();
    throw new Error(`Error ${res.status} ${res.statusText}: ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return {} as any;
}

export function sumaDenominaciones(denoms: Denominacion[]): number {
  return denoms.reduce((acc, d) => acc + d.billete * d.cantidad, 0);
}

