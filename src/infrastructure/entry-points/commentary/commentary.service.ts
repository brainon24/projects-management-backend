import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';
import { CommentaryDBRepository } from '../../driven-adapters/mongo-adapter/commentary/commentary.repository';
import { QueryParamsDto } from '../common/dto/query-params.dto';
import { ICommentaryDBRepository } from './commentary.repository.types';
import { MailService } from 'src/infrastructure/driven-adapters/mail-adapter/service';
import { ProjectService } from '../project/project.service';
import { UserService } from '../auth/user.service';

@Injectable()
export class CommentaryService implements ICommentaryDBRepository {
  constructor(
    private readonly commentaryRepository: CommentaryDBRepository,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async create(createCommentaryDto: CreateCommentaryDto) {
    await this.commentaryRepository.create(createCommentaryDto);

    const project = await this.projectService.findById(
      createCommentaryDto.projectId as any,
    );

    const authorProject = await this.userService.findById(
      project.authorId as any,
    );
    const authorComment = await this.userService.findById(
      createCommentaryDto.authorId as any,
    );

    await this.mailService.send({
      project,
      authorProject,
      authorComment,
      comment: createCommentaryDto,
    });
  }

  findAllByProject(projectId: string, params: QueryParamsDto) {
    return this.commentaryRepository.findAllByProject(projectId, params);
  }

  update(commentaryId: string, updateCommentaryDto: UpdateCommentaryDto) {
    return this.commentaryRepository.update(commentaryId, updateCommentaryDto);
  }

  remove(commentaryId: string) {
    return this.commentaryRepository.remove(commentaryId);
  }

  removeByProjectId(projectId: string) {
    return this.commentaryRepository.removeByProjectId(projectId);
  }
}
