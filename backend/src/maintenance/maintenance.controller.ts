import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Query } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('maintenance')
export class MaintenanceController {
    constructor(private readonly maintenanceService: MaintenanceService) { }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createMaintenanceLogDto: any) {
        return this.maintenanceService.create(createMaintenanceLogDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(@Query('vehicleId') vehicleId?: string) {
        if (vehicleId) {
            return this.maintenanceService.findByVehicle(vehicleId);
        }
        return this.maintenanceService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.maintenanceService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMaintenanceLogDto: any) {
        return this.maintenanceService.update(id, updateMaintenanceLogDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.maintenanceService.remove(id);
    }
}
