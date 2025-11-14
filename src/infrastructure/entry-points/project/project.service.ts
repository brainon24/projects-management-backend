import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDBRepository } from '../../driven-adapters/mongo-adapter/project/project.repository';
import { IProjectDBRepository } from './project.repository.types';
import { Project } from './entities/project.entity';
import { QueryParamsDto } from '../common/dto/query-params.dto';
import { PatchStatusDto } from './dto/patch-status.dto';
import { CommentaryService } from '../commentary/commentary.service';

@Injectable()
export class ProjectService implements IProjectDBRepository {
  constructor(
    private readonly projectRepository: ProjectDBRepository,
    @Inject(forwardRef(() => CommentaryService))
    private readonly commentaryService: CommentaryService
  ) {}

  create(createProjectDto: CreateProjectDto) {
    return this.projectRepository.create(createProjectDto);
  }

  findAll(params: QueryParamsDto) {
    return this.projectRepository.findAll(params);
  }

  findById(projectId: string): Promise<Project> {
    return this.projectRepository.findById(projectId);
  }

  findByBusinessId(
    businessId: string,
    params: QueryParamsDto,
  ): Promise<Project | Project[]> {
    return this.projectRepository.findByBusinessId(businessId, params);
  }

  findByUserId(
    userId: string,
    params: QueryParamsDto,
  ): Promise<Project | Project[]> {
    return this.projectRepository.findByUserId(userId, params);
  }

  findByResponsibleId(
    resonsibleId: string,
    params: QueryParamsDto,
  ): Promise<Project | Project[]> {
    return this.projectRepository.findByResponsibleId(resonsibleId, params);
  }

  patchStatus(projectId: string, payload: PatchStatusDto): Promise<void> {
    this.projectRepository.patchStatus(projectId, payload);
    return;
  }

  update(projectId: string, payload: UpdateProjectDto): Promise<Project> {
    return this.projectRepository.update(projectId, payload);
  }

  async remove(projectId: string): Promise<void> {
    await this.projectRepository.remove(projectId);
    await this.commentaryService.removeByProjectId(projectId);
    return;
  }
}
