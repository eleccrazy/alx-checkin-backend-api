import { HubEntity } from 'src/entities/hubs.entity';
// Define an interface for habs query service
export interface IHubsQueryService {
  getAllhubs(): Promise<HubEntity[]>;
  getSingleHub(id: string): Promise<HubEntity>;
}

// Define an interface for hubs command service
export interface IHubsCommandService {
  createHub(name: string): Promise<HubEntity>;
  updateHub(id: string, name: string): Promise<HubEntity>;
  deleteHub(id: string): Promise<{ message: string }>;
}
