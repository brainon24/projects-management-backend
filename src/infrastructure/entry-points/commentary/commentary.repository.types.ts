import { Commentary } from './entities/commentary.entity';
import { QueryParamsDto } from '../common/dto/query-params.dto';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';

export abstract class ICommentaryDBRepository {
  abstract create(payload: CreateCommentaryDto): Promise<void>;
  abstract findAllByProject(
    projectId: string,
    params: QueryParamsDto,
  ): Promise<Commentary[]>;
  abstract update(
    commentaryId: string,
    payload: UpdateCommentaryDto,
  ): Promise<Commentary>;
  abstract remove(commentaryId: string): Promise<void>;
}
