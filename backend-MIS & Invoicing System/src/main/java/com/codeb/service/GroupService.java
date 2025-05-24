package com.codeb.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.codeb.entity.Group;
import com.codeb.jpa.GroupRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    // Add a new group
    public Group addGroup(Group group) {
        if (groupRepository.findByName(group.getName()).isPresent()) {
            throw new RuntimeException("Group name already exists: " + group.getName());
        }
        return groupRepository.save(group);
    }

    // Get all groups
    public List<Group> getAllGroups() {
        return groupRepository.findByIsActive(true); 
    }


    // Update group name
    public Group updateGroup(Long groupId, String newGroupName) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));
        if (groupRepository.findByName(newGroupName).isPresent()) {
            throw new RuntimeException("Group name already exists: " + newGroupName);
        }
        group.setName(newGroupName);
        return groupRepository.save(group);
    }

    // Soft delete group
    public void deleteGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));
        if (group.isLinkedToChain()) {
            throw new RuntimeException("Group is linked to a chain and cannot be deleted: " + groupId);
        }
        group.setActive(false); 
        groupRepository.save(group);
    }
}
