import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from 'src/infrastructure/entry-points/project/dto/create-project.dto';
import { UpdateProjectDto } from 'src/infrastructure/entry-points/project/dto/update-project.dto';
import { Project } from 'src/infrastructure/entry-points/project/entities/project.entity';
import { IProjectDBRepository } from '../../../entry-points/project/project.repository.types';
import { ProjectSpec } from './project.schema';


export class ProjectDBRepository implements IProjectDBRepository {

    constructor(
        @InjectModel('Project') private projectModel: Model<ProjectSpec>
    ){}

    /**
     * Create a new Project
     * @param payload
     * @return a Promise of Project
    */
    async create(payload: CreateProjectDto): Promise<Project> {
        try {
            const newProject = await new this.projectModel(payload).save();

            return newProject;
        } catch (error) {
            console.warn(error);
            throw new BadRequestException('Ocurrio un error al crear el proyecto');
        }
    }

    /**
     * Find All Projects
     * @return a Promise of Projects
    */
    async findAll(): Promise<Project[]> {
        try {
            const projects = await this.projectModel.find().exec();

            return projects;
        } catch (error) {
            console.warn(error);
            throw new BadRequestException('Ocurrio un error al obtener los proyecto');
        }
    }

    /**
     * Find Project By Id
     * @param projectId
     * @return a Promise of Project
    */
    async findById(projectId: string): Promise<Project> {
        try {
            const project = await this.projectModel.findById(projectId);

            if( !project ) {
                throw new NotFoundException('Proyecto no encontrado');
            }

            return project;
        } catch (error) {
            console.warn(error);
            throw new NotFoundException('Proyecto no encontrado');
        }
    }

    /**
     * Find Project By Bussines Id
     * @param businessId
     * @return a Promise of Project
    */
    async findByBusinessId(businessId: string): Promise<Project | Project[]> {
        try {
            const projects = await this.projectModel.find({businessId});

            if( !projects ) {
                throw new NotFoundException('No se encontraron proyectos con el ID del negocio');
            }

            return projects;
        } catch (error) {
            console.warn(error);
            throw new NotFoundException('No se encontraron proyectos con el ID del negocio');
        }
    }

    /**
     * Find Project By User Id
     * @param userId
     * @return a Promise of Project
    */
    async findByUserId(userId: string): Promise<Project | Project[]> {
        try {
            const projects = await this.projectModel.find({authorId: userId}).exec();

            if( !projects ) {
                throw new NotFoundException('No se encontraron proyectos con el ID del usuario');
            }

            return projects;
        } catch (error) {
            console.warn(error);
            throw new NotFoundException('No se encontraron proyectos con el ID del usuario');
        }
    }

    /**
     * Update Project
     * @param payload
     * @return a Promise of Project
    */
    async update(payload: UpdateProjectDto): Promise<Project> {
        const { projectId } = payload;
        try {
            const project = await this.projectModel.findByIdAndUpdate({ _id: projectId }, payload);

            if( !project ){
                throw new NotFoundException('No se encontro ningún proyecto con el ID del proyecto');
            }

            return project;
        } catch (error) {
            console.warn(error);
            throw new NotFoundException(error.message);
        }
    }
    
    /**
     * Remove Project
     * @param projectId
     * @return a Promise of Project
    */
    async remove(projectId: string): Promise<void> {
        try {
            const project = await this.projectModel.findByIdAndDelete({ _id: projectId });

            if( !project ){
                throw new NotFoundException('No se encontro ningún proyecto con el ID del proyecto');
            }

            return;
        } catch (error) {
            console.warn(error);
            throw new NotFoundException(error.message);
        }
    }

}