import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";

type DashboardState = {
  isDashboardOpen: boolean;
  activeTableId: string | null;
};

type DashboardActions = {
  setIsDashboardOpen: (isDashboardOpen: boolean) => void;
  setActiveTableId: (activeTableId: string | null) => void;
};

export type DashboardStore = DashboardState & DashboardActions;

const defaultInitState: DashboardState = {
  isDashboardOpen: false,
  activeTableId: null,
};

export const createDashboardStore: ImmerStateCreator<DashboardStore> = (
  set,
) => ({
  ...defaultInitState,
  setIsDashboardOpen: (isDashboardOpen: boolean) =>
    set((state) => {
      state.isDashboardOpen = isDashboardOpen;
      state.activeTableId = isDashboardOpen ? state.activeTableId : null;
    }),
  setActiveTableId: (activeTableId: string | null) =>
    set((state) => {
      state.isDashboardOpen = true;
      state.activeTableId = activeTableId;
    }),
});
