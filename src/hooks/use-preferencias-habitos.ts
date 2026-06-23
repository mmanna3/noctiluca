import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferenciasHabitosState {
	ocultarSemanaActual: boolean;
	setOcultarSemanaActual: (valor: boolean) => void;
}

export const usePreferenciasHabitos = create<PreferenciasHabitosState>()(
	persist(
		(set) => ({
			ocultarSemanaActual: true,
			setOcultarSemanaActual: (valor) => set({ ocultarSemanaActual: valor }),
		}),
		{
			name: "preferencias-habitos",
		},
	),
);
